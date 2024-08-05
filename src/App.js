import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Avataaar from './Components/Avatar/Avatar';

function App() {
  const [attributes, setAttributes] = useState({
    topType: 'ShortHairDreads02',
    accessoriesType: 'Prescription02',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    clotheType: 'Hoodie',
    clotheColor: 'PastelBlue',
    eyeType: 'Happy',
    eyebrowType: 'Default',
    mouthType: 'Smile',
    avatarStyle: 'Circle',
    skinColor: 'Light',
  });
  return (
    <>
      <Avataaar value={attributes} onChange={setAttributes} />
    </>
  );
}

export default App;
