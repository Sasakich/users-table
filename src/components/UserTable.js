import {useRef} from 'react';

export default function UserTable({users, sort, setSort, onRowClick}) {
    const tableRef = useRef(null);

    const toggleSort = (field) => {
        if (sort.field !== field) {
            setSort({field, order: 'asc'});
        } else if (sort.order === 'asc') {
            setSort({field, order: 'desc'});
        } else {
            setSort({field: null, order: null});
        }
    };

    const arrow = (field) =>
        sort.field === field ? (sort.order === 'asc' ? '▲' : '▼') : '';

    const startResize = (e, index) => {
        e.preventDefault();
        const th = tableRef.current.querySelectorAll('th')[index];
        const startX = e.clientX;
        const startWidth = th.offsetWidth;

        const onMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            if (newWidth >= 50) {
                th.style.width = `${newWidth}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const headers = [
        {label: 'Фамилия', field: 'lastName', sortable: true},
        {label: 'Имя', field: 'firstName', sortable: true},
        {label: 'Отчество', field: null},
        {label: 'Возраст', field: 'age', sortable: true},
        {label: 'Пол', field: 'gender', sortable: true},
        {label: 'Телефон', field: 'phone', sortable: true},
        {label: 'Email', field: null},
        {label: 'Страна', field: null},
        {label: 'Город', field: null}
    ];

    return (
        <table ref={tableRef}>
            <thead>
            <tr>
                {headers.map((h, index) => (
                    <th
                        key={index}
                        onClick={h.sortable ? () => toggleSort(h.field) : undefined}
                        style={{position: 'relative'}}
                    >
                        <div className="th-content">
                            <span className="th-text">{h.label}</span>
                            {h.sortable && <span className="th-arrow">{arrow(h.field)}</span>}
                        </div>

                        {/* РЕСАЙЗЕР */}
                        <div
                            onMouseDown={(e) => startResize(e, index)}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: 6,
                                height: '100%',
                                cursor: 'col-resize',
                                userSelect: 'none'
                            }}
                        />
                    </th>
                ))}
            </tr>
            </thead>

            <tbody>
            {users.map((u) => (
                <tr key={u.id} onClick={() => onRowClick(u)}>
                    <td>{u.lastName}</td>
                    <td>{u.firstName}</td>
                    <td>{u.maidenName}</td>
                    <td>{u.age}</td>
                    <td>{u.gender}</td>
                    <td>{u.phone}</td>
                    <td>{u.email}</td>
                    <td>{u.address.country}</td>
                    <td>{u.address.city}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
