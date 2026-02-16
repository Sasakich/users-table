import { useEffect, useState, useCallback } from 'react';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import UserModal from './components/UserModal';

const PAGE_SIZE = 10;

export default function App() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ field: null, order: null });
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        fio: '',
        ageFrom: '',
        ageTo: '',
        gender: 'all',
        phone: ''
    });

    const loadUsers = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch('https://dummyjson.com/users?limit=100');
            const data = await res.json();
            setUsers(data.users);
        } catch {
            setError('Ошибка загрузки пользователей');
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filtered = users.filter(u => {
        const fio = `${u.lastName} ${u.firstName} ${u.maidenName}`.toLowerCase();
        if (filters.fio && !fio.includes(filters.fio.toLowerCase())) return false;
        if (filters.gender !== 'all' && u.gender !== filters.gender) return false;
        if (filters.ageFrom && u.age < filters.ageFrom) return false;
        if (filters.ageTo && u.age > filters.ageTo) return false;
        if (filters.phone && !u.phone.includes(filters.phone)) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (!sort.field) return 0;
        const dir = sort.order === 'asc' ? 1 : -1;
        return a[sort.field] > b[sort.field] ? dir : -dir;
    });

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="app">
            <div className="filters">
                <input placeholder="ФИО" value={filters.fio}
                       onChange={e => { setFilters({ ...filters, fio: e.target.value }); setPage(1); }} />
                <input type="number" placeholder="Возраст от" value={filters.ageFrom}
                       onChange={e => { setFilters({ ...filters, ageFrom: e.target.value }); setPage(1); }} />
                <input type="number" placeholder="Возраст до" value={filters.ageTo}
                       onChange={e => { setFilters({ ...filters, ageTo: e.target.value }); setPage(1); }} />
                <select value={filters.gender}
                        onChange={e => { setFilters({ ...filters, gender: e.target.value }); setPage(1); }}>
                    <option value="all">Все</option>
                    <option value="male">Мужчины</option>
                    <option value="female">Женщины</option>
                </select>
                <input placeholder="Телефон" value={filters.phone}
                       onChange={e => { setFilters({ ...filters, phone: e.target.value }); setPage(1); }} />
            </div>

            {error && <div>{error}</div>}

            <UserTable users={paged} sort={sort} setSort={setSort} onRowClick={setSelectedUser} />

            <Pagination page={page} total={totalPages} onChange={setPage} />

            {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
