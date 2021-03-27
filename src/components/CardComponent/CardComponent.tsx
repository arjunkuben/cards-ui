import { Card } from 'react-bootstrap';
import './CardComponent.scss';
import axios from 'axios';
import { CardColumns } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const CardComponent = () => {
    const [userProfileDetails, setUserProfileDetails] = useState<any>([]);
    const [showFilterData, setShowFilterData] = useState<any>([]);
    const [searchField, setSearchField] = useState('');
    let history = useHistory();
    const getLocalItem = localStorage.getItem('fetchedProfiles');
    const [rating, setRating] = useState(0);

	useEffect(() => {
        if (typeof getLocalItem === 'string') {
            try {
                const parseItems = JSON.parse(getLocalItem);
                if (Array.isArray(parseItems) && parseItems.length) {
                    setUserProfileDetails([...parseItems]);
                    setShowFilterData([...parseItems]);
                } else {
                    getProfiles();
                }
            } catch (err) {
                console.log(err);
                getProfiles();
            }
        } else {
            getProfiles();
        }
	}, []);

    const getProfiles = () => {
        axios.get(`https://s3-ap-southeast-1.amazonaws.com/he-public-data/TopRamen8d30951.json`)
            .then( async (res: any) => {
                const getRes = [...res.data];
                const getImageRes: any = await getImages();
                const getLength = getImageRes.length;
                getRes.forEach((value, i) => {
                    value.id = value.Brand.replace(' ', '') + i;
                    value.Image = getLength ? getRandomImage(getImageRes, getLength) : '';
                });
                localStorage.setItem('fetchedProfiles', JSON.stringify(getRes));
                setUserProfileDetails([...getRes]);
                setShowFilterData([...getRes]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getImages = () => {
        return new Promise((resolve) => {
            axios.get(`https://s3-ap-southeast-1.amazonaws.com/he-public-data/noodlesec253ad.json`)
                .then((res: any) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    resolve([]);
                })
        });
    }

    const getRandomImage = (randomImage: any, len: any) => {
        const getRandomIndex = Math.floor(Math.random() * len);
        return randomImage[getRandomIndex].Image;
    }

    const deleteProfile = (id: string) => {
        if (typeof getLocalItem === 'string') {
            try {
                let parseItems = JSON.parse(getLocalItem);
                const getIndex = parseItems.findIndex((value: any) => value.id === id);
                parseItems.splice(getIndex, 1);
                localStorage.setItem('fetchedProfiles', JSON.stringify(parseItems));
                setUserProfileDetails([...parseItems]);
            } catch (err) {
                console.log(err);
            }
        }
    }

    const applyFilter = (value: string) => {
        let setFilter = [...userProfileDetails];
        if (value || rating) {
            setFilter = userProfileDetails.filter((detailsValue: any) => {
                if (rating && value) {
                    return (
                        detailsValue.Brand.toLowerCase().includes(value.toLowerCase())
                        &&
                        Math.floor(detailsValue.Stars) === rating
                    );
                } else if (rating && !value) {
                    return Math.floor(detailsValue.Stars) === rating;
                }
                return detailsValue.Brand.toLowerCase().includes(value.toLowerCase());
            })
        }
        setShowFilterData(setFilter);
        setSearchField(value);
    }

    const applyFilterRating = (targetValue: any) => {
        const getValue = parseInt(targetValue);
        let setFilter = [...userProfileDetails];
        if((getValue && !isNaN(getValue)) || searchField) {
            setFilter = userProfileDetails.filter((detailsValue: any) => {
                if (searchField && getValue) {
                    return Math.floor(detailsValue.Stars) === getValue && detailsValue.Brand.toLowerCase().includes(searchField.toLowerCase())
                } else if (searchField && !getValue) {
                    return detailsValue.Brand.toLowerCase().includes(searchField.toLowerCase());
                }
                return Math.floor(detailsValue.Stars) === getValue;
            });
        }
        setShowFilterData(setFilter);
        setRating(getValue);
    }
    
    return (
        <React.Fragment>
            <div className="form-row">
                <div className="form-group col-md-4">
                    <input type="text" placeholder="Search Brand" onChange={(e) => applyFilter(e.target.value)} className="form-control" value={searchField} />
                </div>
                <div className="form-group col-md-2 offset-md-6">
                    <select className="form-control" value={rating} onChange={(e) => applyFilterRating(e.target.value)}>
                        <option value="0" disabled>Sory By Rating</option>
                        {
                            [1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value}</option>)
                        }
                        <option value="0">Reset</option>
                    </select>
                </div>
            </div>
            {
                Array.isArray(showFilterData) && showFilterData.length ?
                    <CardColumns>
                        {
                            showFilterData.map((profile) => {
                                return (
                                    <Card
                                        bg={'dark'}
                                        text={'white'}
                                        key={profile.id}
                                        className="p-4"
                                        onClick={() => { history.push(`/${profile.id}`) }}
                                    >
                                        <Card.Img width={320} height={320} variant="top" src={profile.Image} />
                                        <Card.Body>
                                            <Card.Title>
                                                {profile.Brand}&nbsp; 
                                                {
                                                    [1, 2, 3, 4, 5].map(value => {
                                                        if (value <= profile.Stars) {
                                                            return <span className="fa fa-star checked" key={value}></span>
                                                        } else {
                                                            return <span className="fa fa-star" key={value}></span>
                                                        }
                                                    })
                                                }
                                            </Card.Title>
                                            <Card.Text>
                                                <span>Variety: {profile.Variety}</span>
                                                <br/>
                                                <span>Style: {profile.Style}</span>
                                                <br/>
                                                <span>Country: {profile.Country}</span>
                                            </Card.Text>
                                        </Card.Body>
                                        {/* <Card.Footer>
                                            <Button variant="primary" onClick={() => { history.push(`/${profile.id}`) }}>View</Button>&nbsp;&nbsp;
                                            <Button variant="danger" onClick={() => deleteProfile(profile.id)}>Delete</Button>
                                        </Card.Footer> */}
                                    </Card>
                                )
                            })
                        }
                    </CardColumns>
                :
                    <h1 className="display-6 text-center">No Profile Found</h1>
            }
        </React.Fragment>
    )
}

export default CardComponent;
