import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType, setIsInitialisedAC, SetIsInitialisedActionType,
} from '../../app/app-reducer'
import {LoginDateType} from "./Login";
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// thunks
export const loginTC = (data: LoginDateType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }

        dispatch(setAppStatusAC('idle'))
    })
        .catch((err) => {
            handleServerNetworkError(err, dispatch)
        })
}

export const meTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }

        dispatch(setAppStatusAC('idle'))
    })
        .catch((err) => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitialisedAC(true))
        })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
        } else {
            handleServerAppError(res.data, dispatch)
        }

        dispatch(setAppStatusAC('idle'))
    })
        .catch((err) => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitialisedAC(true))
        })
}

// types
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitialisedActionType