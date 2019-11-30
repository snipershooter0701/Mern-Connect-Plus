import {
    PERSON_FETCHING,
    PERSON_FETCHED,
    PERSON_RESET,
    PERSON_ERROR,
} from '../types';
import isEmpty from '../../validation/isEmpty';

const initialState = {
    showLoader: false,
    success: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case PERSON_FETCHING:
            return {
                ...state,
                showLoader: true,
                success: null,
            };

        case PERSON_FETCHED:
            const user = action.payload;
            return {
                ...state,
                ...user,
                success: true,
                showLoader: false,
            };

        case PERSON_RESET:
            return initialState;

        case PERSON_ERROR:
            return {
                ...state,
                success: false,
                showLoader: false,
            };

        default:
            return state;
    }
}