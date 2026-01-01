import { FeedbackSort } from '../constans/FeedbackSort';

export interface Feedback {
    id: string;
    rating: number;
    date_time: string;
    feedback_text?: string;
}

export type FeedbackSort = (typeof FeedbackSort)[keyof typeof FeedbackSort];

export interface GetFeedbacksParams {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: FeedbackSort;
    caseSensitive?: boolean;
    wholeWord?: boolean;
}

export interface FeedbackResponse {
    items: Feedback[];
    total: number;
    totalPages: number;
}
