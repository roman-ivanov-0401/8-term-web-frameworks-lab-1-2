export type LoginFormValues = {
	email: string;
	password: string;
};

export type RegisterFormValues = {
	email: string;
	password: string;
};

export const handleLoginSubmit = (values: LoginFormValues): void => {
	console.log('Login submit:', values);
};

export const handleRegisterSubmit = (values: RegisterFormValues): void => {
	console.log('Register submit:', values);
};
