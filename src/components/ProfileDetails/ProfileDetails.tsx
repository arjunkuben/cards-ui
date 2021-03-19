import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Figure } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ProfileDetails = () => {
    let { id } = useParams<any>();
    let profileDetails: any = localStorage.getItem('fetchedProfiles') ? localStorage.getItem('fetchedProfiles') : null;
    let findProfile: any = {};
    const [edit, setEdit] = useState<boolean>(false);
    const [name, setName] = useState('');

    if (typeof profileDetails === 'string' && id) {
        try {
            profileDetails = JSON.parse(profileDetails);
            findProfile = profileDetails.find((value: any) => value.id == id);
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
            <Figure>
                <Figure.Image
                    alt="profile-image"
                    src={findProfile.Image}
                />
                <Figure.Caption className="text-right">
                    {
                        edit ?
                            <input type="text" className="form-control" value={name} placeholder='Enter name' onChange={e => setName(e.target.value)} />
                        :
                            name
                    }
                    <br/><br/>
                    <Button variant="secondary" onClick={() => updateProfiles()}>{ edit ? 'Update' : 'Edit' }</Button>
                </Figure.Caption>
            </Figure>
        :
            <h1 className="display-6 text-center">Invalid Profile</h1>
    );
}

export default ProfileDetails;