export default function UserModal({ user, onClose }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <img src={user.image} alt="" width="100" />
                <p><b>ФИО:</b> {user.lastName} {user.firstName} {user.maidenName}</p>
                <p><b>Возраст:</b> {user.age}</p>
                <p><b>Адрес:</b> {user.address.country}, {user.address.city}, {user.address.address}</p>
                <p><b>Рост / Вес:</b> {user.height} / {user.weight}</p>
                <p><b>Телефон:</b> {user.phone}</p>
                <p><b>Email:</b> {user.email}</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}
