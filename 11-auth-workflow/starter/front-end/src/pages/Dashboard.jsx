import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import main from '../assets/main.svg';
import { useGlobalContext } from '../context';
function Dashboard() {
  const { user: user } = useGlobalContext();
  const navigate = useNavigate()
  // const { name, userId, role } = user;

  if (!user) {

    return navigate('/')
    
  }

  return (
    <>
      <Wrapper className='page'>
        <h2>Hello there, {user?.name}</h2>
        <p>
          Your ID : <span>{user?.userId}</span>
        </p>
        <p>
          Your Role : <span>{user?.role}</span>
        </p>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  p span {
    background: var(--primary-500);
    padding: 0.15rem 0.25rem;
    color: var(--white);
    border-radius: var(--borderRadius);
    letter-spacing: var(--letterSpacing);
  }
`;

export default Dashboard;
