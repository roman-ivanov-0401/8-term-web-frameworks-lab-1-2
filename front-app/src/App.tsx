import { ConfigProvider } from 'antd';
import AppView from './views/AppView';

const theme = {
	token: {
		colorPrimary: '#6F4E37',
		colorPrimaryHover: '#8B6347',
		colorPrimaryActive: '#5A3D29',
		colorLink: '#6F4E37',
		colorLinkHover: '#8B6347',
		colorBgBase: '#FAF6F1',
		colorBgContainer: '#FFF8F2',
		colorBorder: '#D4B896',
		colorBorderSecondary: '#E8D5C0',
		colorText: '#3B2A1A',
		colorTextSecondary: '#7A5C44',
		colorTextPlaceholder: '#B08D72',
		colorError: '#C0392B',
		borderRadius: 8,
		fontFamily: "'Inter', sans-serif",
	},
};

const App = () => {
	return (
		<ConfigProvider theme={theme}>
			<AppView />
		</ConfigProvider>
	);
};

export default App;

