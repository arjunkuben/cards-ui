import { Card, Button } from 'react-bootstrap';
import './CardComponent.scss';
import axios from 'axios';
import { CardColumns } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const CardComponent = () => {
    const [userProfileDetails, setUserProfileDetails] = useState<any>([]);
    let history = useHistory();
    const getLocalItem = localStorage.getItem('fetchedProfiles');

	useEffect(() => {
        if (typeof getLocalItem === 'string') {
            try {
                const parseItems = JSON.parse(getLocalItem);
                Array.isArray(parseItems) && parseItems.length ? setUserProfileDetails([...parseItems]) : getProfiles();
            } catch (err) {
                console.log(err);
                getProfiles();
            }
        } else {
            getProfiles();
        }
	}, []);

    const getProfiles = () => {
        axios.get(`https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json`)
            .then((res: any) => {
                localStorage.setItem('fetchedProfiles', JSON.stringify(res.data));
                setUserProfileDetails([...res.data]);
            })
            .catch(function (error) {
                console.log(error);
            })
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
    
    return (
        Array.isArray(userProfileDetails) ?
            <CardColumns>
                {
                    userProfileDetails.map((profile) => {
                        return (
                            <Card
                                bg={'dark'}
                                text={'white'}
                                key={profile.id}
                                className="p-4"
                            >
                                <Card.Img width={320} height={320} variant="top" src={profile.Image} />
                                <Card.Body>
                                    <Card.Title>{profile.name}</Card.Title>
                                    <Card.Text>
                                        This User Id is: {profile.id}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" onClick={() => { history.push(`/${profile.id}`) }}>View</Button>&nbsp;&nbsp;
                                    <Button variant="danger" onClick={() => deleteProfile(profile.id)}>Delete</Button>
                                </Card.Footer>
                            </Card>
                        )
                    })
                }
            </CardColumns>
        :
            <h1 className="display-6 text-center">No Profile Found</h1>
    )
}

export default CardComponent;
