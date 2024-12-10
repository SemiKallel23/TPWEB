// Correction : Renommez l'énumération correctement
export enum DataStateEnum {
    LOADING,
    LOADED,
    ERROR
}

// Interface pour gérer les états de données
export interface AppDataState<T> {
    dataState: DataStateEnum; // Utilisation correcte de l'énumération
    data?: T; // Les données facultatives
    errorMessage?: string; // Message d'erreur facultatif
}
