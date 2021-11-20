import React from 'react';
import { Link, useHistory } from '../core/Router';

const LinkedHello: React.FC = () => {
  const history = useHistory();
  console.log(history.location.state);

  return <Link to="/world">World로 이동</Link>;
};

export default LinkedHello;
