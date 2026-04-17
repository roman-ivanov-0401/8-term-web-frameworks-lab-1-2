import { Button, Result } from 'antd';
import styles from './RemoteUnavailable.module.scss';

type RemoteUnavailableProps = {
	serviceName: string;
	onRetry: () => void;
};

const RemoteUnavailable = ({ serviceName, onRetry }: RemoteUnavailableProps) => {
	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<Result
					status="warning"
					title="Сервис временно недоступен"
					subTitle={`Микрофронтенд "${serviceName}" сейчас не отвечает. Попробуйте повторить загрузку через несколько секунд.`}
					extra={(
						<div className={styles.actions}>
							<Button type="primary" onClick={onRetry}>
								Повторить
							</Button>
							<Button href="/profile">
								Перейти в профиль
							</Button>
						</div>
					)}
				/>
			</div>
		</div>
	);
};

export default RemoteUnavailable;
