import { Modal, Tag } from 'antd';
import { type MatchItem } from '../../modules/MatchesModule';
import s from './MatchModal.module.scss';

type MatchModalProps = {
	open: boolean;
	match: MatchItem;
	onClose: () => void;
};

function MatchModal({ open, match, onClose }: MatchModalProps) {
	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			centered={true}
			width={480}
		>
			<div className={s.modal}>
				<div className={s.modalHeader}>
					<div className={s.modalAvatar}>{match.initials}</div>
					<div className={s.modalMeta}>
						<h3 className={s.modalName}>{match.userName}</h3>
						<span className={s.modalScore}>Совпадение {match.score * 100}%</span>
					</div>
				</div>

				{match.description && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>О себе</h4>
						<p className={s.modalDescription}>{match.description}</p>
					</section>
				)}

				{match.commonDrinks.length > 0 && (
					<section className={s.modalSection}>
						<h4 className={s.modalSectionTitle}>Общие напитки</h4>
						<div className={s.modalTags}>
							{match.commonDrinks.map((drink) => (
								<Tag key={drink} color="brown">
									{drink}
								</Tag>
							))}
						</div>
					</section>
				)}
			</div>
		</Modal>
	);
}

export default MatchModal;
