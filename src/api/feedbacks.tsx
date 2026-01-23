import axios from 'axios';
import { type FeedbackResponse, type GetFeedbacksParams } from '../interfaces/Feedback';

export async function getFeedbacks(
    params: GetFeedbacksParams,
    signal?: AbortSignal
): Promise<FeedbackResponse> {
    const res = await axios.get('/api', {
        params,
        signal,
    });

    return res.data;
}
