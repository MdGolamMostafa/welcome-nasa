import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import {useHistory, useLocation } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";
import handleError from './ErrorHandler';
import InputItem from './InputItem';
import { createUserWithEmailAndPassword, handleFacebookSignIn, handleGoogleSignIn, initializeFirebase, signInWithEmailAndPassword } from './HandleLogin';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useDispatch } from 'react-redux';
import {storeUserData} from '../../redux/actions/userAction';
initializeFirebase()
const initUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {}
}



const Login = () => {
    const history = useHistory();
    const location = useLocation();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    
    const  dispatch = useDispatch();
    
    let { from } = location.state || { from: { pathname: "/" } };
    const [loading, setLoading] = useState(false)
    const [newUser, setNewUser] = useState(true)
    const [userInfo, setUserInfo] = useState({ ...initUser });

    const onChangeHandler = e => {
        setUserInfo(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
        e.persist()
    }

    const submitHandler = e => {
        const errors = handleError(userInfo);
        setUserInfo({ ...userInfo, errors })
        if (Object.keys(errors).length === 0 && newUser) {
        setLoading(true)
        createUserWithEmailAndPassword({ firstName, lastName, email, password })
            .then(res => {
              const user = { 
                email: email
              }
              dispatch(storeUserData(user));
            setLoading(false)
            if (res.error) {
                setUserInfo({ ...userInfo, errors: res })
            } else {
                setLoggedInUser({...res})
                history.replace(from)
            }
            })
        }
        if (!errors.email && !errors.password) {
        if (userInfo.password && userInfo.email && !newUser) {
            setLoading(true)
            signInWithEmailAndPassword({ email, password })
            .then(res => {
              const user = { 
                email: email
              }
              dispatch(storeUserData(user));

                setLoading(false)
                if (res.error) {
                setUserInfo({ ...userInfo, errors: res })
                } else {
                setLoggedInUser({...res})
                history.replace(from)
                }
            })
        }
        }
        e.preventDefault();
    }

    const googleSignIn = () => {
        handleGoogleSignIn()
        .then(res => {
          const user = { 
                email: email
              }
              dispatch(storeUserData(user));

            if (res.error) {
            setUserInfo({ ...userInfo, errors: res })
            } else {
            setLoggedInUser({...res})
            history.replace(from)
            }
        })
    }

    const facebookSignIn = () => {
        handleFacebookSignIn()
        .then(res => {
              const user = { 
                email: email
              }
              dispatch(storeUserData(user));
            if (res.error) {
            setUserInfo({ ...userInfo, errors: res })

            } else {
            setLoggedInUser({...res})
                history.replace(from)
            }
        })

    };


    useEffect(() => {
        setUserInfo({ ...initUser })
    }, [newUser])

    useEffect(() => {
        console.log('form login');
    }, [])
    const { firstName, lastName, email, password, confirmPassword, errors } = userInfo;
    // if(loggedInUser){
    //   return <Redirect to ='/'/>
    // }


    if (loading) {
        return (
        <div className="sweet-loading">
            <FadeLoader
            size={150}
            loading={loading}
            />
        </div>
        );
    }


    return (
        <Container className="pr-0 pt-5">
          <Row>
            <Col sm={8} className="m-auto" xl={6} md="8">
              <Card>
                <Card.Body>
                  <h2 className="py-1">{newUser ? 'Create an account' : 'Login'}</h2>
                  <Form autoComplete="off" onSubmit={submitHandler}>
                    {newUser && (
                      <InputItem value={firstName}
                        onChangeHandler={onChangeHandler}
                        error={errors.firstName}
                        name="firstName"
                        customClass="loginInput" autoFocus
                        placeholder="First Name" />
                    )}
                    {newUser && (
                      <InputItem value={lastName}
                        onChangeHandler={onChangeHandler}
                        error={errors.lastName}
                        name="lastName"
                        customClass="loginInput"
                        placeholder="Last Name" />
                    )}
                    <InputItem value={email}
                      onChangeHandler={onChangeHandler}
                      error={errors.email}
                      name="email"
                      customClass="loginInput"
                      type="email"
                      placeholder="Email" />
                    <InputItem value={password}
                      onChangeHandler={onChangeHandler}
                      error={errors.password}
                      name="password"
                      type="password"
                      customClass="loginInput"
                      placeholder="Password" />
                    {newUser && (
                      <InputItem value={confirmPassword}
                        onChangeHandler={onChangeHandler}
                        type="password"
                        error={errors.confirmPassword}
                        name="confirmPassword"
                        customClass="loginInput"
                        placeholder="Confirm Password" />
                    )}
                    {errors.error && (
                      <p className="text-danger text-center  py-2">
                        {errors.error}
                      </p>
                    )}
                    <Button className="w-100" variant="success" type="submit">
                      {newUser ? 'Create an Account' : 'Login'}
                    </Button>
                  </Form>
                  <p className="text-center pt-2">
                    {newUser ? 'Already have an account' : 'Don’t have an account'} ?
                    <span onClick={() => setNewUser(!newUser)} className="text-warning login">
                      {newUser ? ' Login' : ' Create an account'}
                    </span>
                  </p>
                </Card.Body>
              </Card>
              <div className="orr mt-2 w-75 text-center">Or</div>

              <div className="google-sign-in mt-2 w-75 text-center" onClick={facebookSignIn}>
                <span> <img className="google mr-3 " src={'https://i.ibb.co/ZXfcXnP/facebook-1.png'} alt="facebook" /> Continue with Facebook </span>
              </div>
              <br />
              <div className="google-sign-in mt-2 w-75 text-center" onClick={googleSignIn}>
                <span> <img className="google mr-4 " src={'https://i.ibb.co/1qyddQc/google-plus.png'} alt="google" /> Continue with google </span>
              </div>
              <br />
              <br />
            </Col>
          </Row>
        </Container>
    );
};

export default Login;