declare module 'otp-generator' {
    const value: {
        generate: (
            length: number,
            {
                digits,
                alphabets,
                upperCase,
                specialChars,
            }: { digits: boolean; alphabets: boolean; upperCase: boolean; specialChars: boolean }
        ) => number;
    };

    export default value;
}
