import react, { PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../App';

export const AuthenticatedRoute = (props: PropsWithChildren) => {
    const { children } = props;
    const { authToken } = useContext(AuthContext);

    if (!authToken) {
        return <Navigate to={'/login'}/>
    }

    return <>{children}</>;
}