import { createContext, useReducer } from 'react';

type tState = {
	isAuthenticated: boolean;
};

const AuthContext = createContext({});

const reducer = () => {};

export default function AuthProvider() {
	const [state, dispatch] = useReducer(reducer, {});

	return <div>Auth</div>;
}
