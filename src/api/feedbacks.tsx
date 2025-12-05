// import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axios, { type AxiosResponse } from 'axios';
import {
    // type Feedback,
    type FeedbackResponse,
    type GetFeedbacksParams,
} from '../interfaces/Feedback';

// export async function getFeedbacks(): Promise<AxiosResponse<Feedback>> {
export async function getFeedbacks(params: GetFeedbacksParams): Promise<FeedbackResponse> {
    return await axios
        .get('http://localhost:2510/api', {
            params: params,
        })
        .then((res: AxiosResponse<FeedbackResponse>) => res.data);
}
