import { jwtDecode } from 'jwt-decode'
import type { DecodedToken } from '../features/Student/types/login.interface'

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token)
    } catch (error) {
        return null
    }
}
