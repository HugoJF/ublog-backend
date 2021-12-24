export interface HttpError {
    httpCode: number;
    toJson(): object;
}
