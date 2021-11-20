import React from 'react';
import { Link, useHistory, useParams } from '../core/Router';

const LinkedHello: React.FC = () => {
  const history = useHistory();
  const params = useParams();

  return (
    <>
      <div>{params?.name}</div>
      <Link to="/world">World로 이동</Link>
    </>
  );
};

export default LinkedHello;
