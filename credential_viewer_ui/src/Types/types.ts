export interface Issue {
    path: string[];
    message: string;
}
export interface ErrorObject {
    issues: Issue[];
}
export interface ErrorsByKey {
    [key: string]: string[] | undefined;
}