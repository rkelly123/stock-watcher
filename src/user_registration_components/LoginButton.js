import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return (
        !isAuthenticated && (
            <button className="user-registration-buttons"
                onClick={() => loginWithRedirect()}>
                Log In
            </button>
        )
    )
}

export default LoginButton
