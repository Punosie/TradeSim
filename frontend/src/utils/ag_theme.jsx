import { colorSchemeDark, themeBalham } from 'ag-grid-community';

const glassStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.1)',
    backdropFilter: 'blur(8px)',
    borderRadius: '0.75rem',
};

const askTheme = themeBalham
    .withPart(colorSchemeDark)
    .withParams({
        ...glassStyle,
        accentColor: 'green',
        textColor: 'rgb(34, 197, 94)',
        fontFamily: 'inherit',
    });

const bidTheme = themeBalham
    .withPart(colorSchemeDark)
    .withParams({
        ...glassStyle,
        accentColor: 'red',
        textColor: 'rgb(239, 68, 68)',
        fontFamily: 'inherit',
    });

export const themes = {
    askTheme,
    bidTheme,
};
