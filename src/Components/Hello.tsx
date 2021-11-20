import React from 'react';
import { Link } from '../core/Router';

const LinkedHello: React.FC = () => {
  return <Link to="/world">World로 이동</Link>;
};

export default LinkedHello;
