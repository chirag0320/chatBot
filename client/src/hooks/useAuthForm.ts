// client/src/hooks/useAuthForm.ts
import { useState } from 'react';

interface FormValues {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    general?: string;
}

export const useAuthForm = (isLogin: boolean) => {
    const [values, setValues] = useState<FormValues>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined })); // clear error on change
    };

    const validate = () => {
        const newErrors: FormErrors = {};

        if (!isLogin && values.username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters.';
        }

        if (!values.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            newErrors.email = 'Please enter a valid email.';
        }

        if (!values.password.trim()) {
            newErrors.password = 'Password is required.';
        } else if (!isLogin && values.password.length < 6 ) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return { values, errors, handleChange, validate, setErrors };
};
