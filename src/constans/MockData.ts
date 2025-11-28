import type { Feedback } from '../interfaces/Feedback';

export const MOCK_DATA: Feedback[] = [
    { id: '1', rating: 5, date_time: '2023-10-25', feedback_text: 'Отличный сервис, спасибо!' },
    { id: '2', rating: 3, date_time: '2023-10-24', feedback_text: 'Долго ждал ответа оператора.' },
    {
        id: '3',
        rating: 1,
        date_time: '2023-10-23',
        feedback_text: 'Ничего не работает, верните деньги.',
    },
    {
        id: '4',
        rating: 4,
        date_time: '2023-10-22',
        feedback_text: 'В целом хорошо, но интерфейс сложный.',
    },
];
