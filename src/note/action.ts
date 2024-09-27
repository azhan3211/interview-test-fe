import axios, { endpoints } from 'src/utils/axios';

import { HttpException } from 'src/utils/httpexception';
import { STORAGE_KEY } from '../auth/context/jwt/constant';
import { NoteType } from './types';

export type NoteCreateParams = {
    title: string;
    content: string;
}

export const getNotes = async (): Promise<NoteType[]> => {
    try {
        const accessToken = sessionStorage.getItem(STORAGE_KEY);

        const res = await axios.get(endpoints.note.list, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (res.status === 200) {
            return res.data.notes;
        }
        throw new HttpException(res.status, res.statusText);
    } catch (error) {
        if (error.response) {
            throw new HttpException(error.response.status, error.response.data.message || 'Unknown error occurred');
        } else if (error.request) {
            throw new HttpException(500, 'Network Error: No response received');
        } else {
            throw new HttpException(500, `Internal Server Error: ${error.message}`);
        }
    }
};

export const createNote = async (noteData: NoteType) => {
    try {
        const accessToken = sessionStorage.getItem(STORAGE_KEY);
        const res = await axios.post(endpoints.note.create, noteData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.status === 201) {
            return res.data.note;
        }
        throw new HttpException(res.status, res.statusText)
    } catch (error) {
        if (error.response) {
            throw new HttpException(error.response.status, error.response.data.message || 'Unknown error occurred');
        } else if (error.request) {
            throw new HttpException(500, 'Network Error: No response received');
        } else {
            throw new HttpException(500, `Internal Server Error: ${error.message}`);
        }
    }
};

export const updateNote = async (note: NoteType) => {
    try {
        const accessToken = sessionStorage.getItem(STORAGE_KEY);
        const res = await axios.put(`${endpoints.note.update}/${note?.id}`, {
            title: note?.title,
            content: note?.content
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Include your JWT token here
            },
        });
        if (res.status === 200) {
            return res.data;
        }
        throw new HttpException(res.status, res.statusText)
    } catch (error) {
        if (error.response) {
            throw new HttpException(error.response.status, error.response.data.message || 'Unknown error occurred');
        } else if (error.request) {
            throw new HttpException(500, 'Network Error: No response received');
        } else {
            throw new HttpException(500, `Internal Server Error: ${error.message}`);
        }
    }
}

export const deleteNote = async (noteId: string) => {
    try {
        const accessToken = sessionStorage.getItem(STORAGE_KEY);
        const res = await axios.delete(`${endpoints.note.delete}/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Include your JWT token here
            },
        });
        if (res.status === 204) {
            return res.data;
        }
        throw new HttpException(res.status, res.statusText)
    } catch (error) {
        if (error.response) {
            throw new HttpException(error.response.status, error.response.data.message || 'Unknown error occurred');
        } else if (error.request) {
            throw new HttpException(500, 'Network Error: No response received');
        } else {
            throw new HttpException(500, `Internal Server Error: ${error.message}`);
        }
    }
};