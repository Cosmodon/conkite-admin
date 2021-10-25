import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	typography: {
		fontFamily: "'Lato', sans-serif",
		subtitle1: {
			fontFamily: "Montserrat, sans-serif",
			textTransform: "uppercase"
		},
		subtitle2: {
			fontFamily: "Montserrat, sans-serif",
			textTransform: "uppercase",
			color: "#0e4b87"
		},

		h1: {
			fontFamily: "Montserrat, sans-serif",
			fontSize: "4rem"
		},

		h2: {
			fontFamily: "Montserrat, sans-serif"
		},

		h3: {
			fontFamily: "Montserrat, sans-serif"
		},

		h4: {
			fontFamily: "Montserrat, sans-serif"
		},
		h5: {
			fontFamily: "Montserrat, sans-serif"
		},
		h6: {
			fontFamily: "Montserrat, sans-serif",
			fontWeight: 500,
			letterSpacing: "0.3rem"
		}
	},
	palette: {
		primary: {
			light: "#fff",
			main: "#ff1700",
			// dark: '#1B365D',
			contrastText: "#fff"
		},
		secondary: {
			light: "#137dc9",
			main: "#1B365D",
			dark: "#135dbd",
			// dark: will be calculated from palette.secondary.main,
			contrastText: "#fff"
		}
	}
});

theme.overrides = {
	MuiTableCell: {
		root: {
			padding: theme.spacing(0.3, 1, 0.3, 1),
			"&:first-child": {
				paddingLeft: 16
			}
		}
	}
};

export default theme;

export const ampTheme = {
	googleSignInButton: { backgroundColor: "red", borderColor: "red" },
	signInButtonIcon: { display: "none" },
	sectionHeader: Object.assign(
		{},
		theme.typography.subtitle2,
		theme.typography.h4
	),
	sectionFooterSecondaryContent: {
		'& a:[data-test="sign-in-create-account-link"]': { display: "none" }
	},
	button: {
		backgroundColor: theme.palette.primary.main,
		borderRadius: theme.spacing(1),
		boxShadow:
			"0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
	},
	a: {
		color: theme.palette.secondary.light
	},
	toast: {
		top: "auto",
		bottom: 0
	}
};
