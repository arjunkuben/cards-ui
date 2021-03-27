import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import './ProfileDetails.scss';

const ProfileDetails = () => {
    let { id } = useParams<any>();
    let profileDetails: any = localStorage.getItem('fetchedProfiles') ? localStorage.getItem('fetchedProfiles') : null;
    let findProfile: any = {};
    let history = useHistory();
    const [edit, setEdit] = useState<boolean>(false);
    const [name, setName] = useState('');

    if (typeof profileDetails === 'string' && id) {
        try {
            profileDetails = JSON.parse(profileDetails);
            findProfile = profileDetails.find((value: any) => value.id === id);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setName(findProfile ? findProfile.name : '');
    }, []);

    const updateProfiles = () => {
        if (edit) {
            try {
                const getIndex = profileDetails.findIndex((value: any) => value.id === id);
                profileDetails[getIndex].name = name;
                localStorage.setItem('fetchedProfiles', JSON.stringify(profileDetails));
                setEdit(false);
            } catch (err) {
                console.log(err);
            }
        } else {
            setEdit(true);
        }
    }

    return (
        findProfile?.hasOwnProperty('Image') ?
            <Card bg={'danger'} text={'white'}>
                <Card.Header as="h5">
                    {findProfile.Brand}&nbsp;                     
                    {
                        [1, 2, 3, 4, 5].map(value => {
                            if (value <= findProfile.Stars) {
                                return <span className="fa fa-star checked" key={value}></span>
                            } else {
                                return <span className="fa fa-star" key={value}></span>
                            }
                        })
                    }
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <img src={findProfile.Image} alt="image of hotel" width="320" height="320" className="rounded float-right"/>
                        Top ten in the world: {findProfile["Top Ten"]}
                    </Card.Title>
                    <Card.Text><b>Diffrent Vaieties:</b> {findProfile.Variety}</Card.Text>
                    <Card.Text><b>Continental Style:</b> {findProfile.Style}</Card.Text>
                    <Card.Text><b>Where we are:</b> {findProfile.Country}</Card.Text>
                    <Button variant="light" onClick={() => { history.push('/') }}>Back to homepage</Button>
                </Card.Body>
            </Card>
        :
            <h1 className="display-6 text-center">Invalid Profile</h1>
    );
}

export default ProfileDetails;