export declare class CreateVeiculoDto {
    marcaId: number;
    modeloId: number;
    versaoId: number;
    ano: number;
    descricao?: string;
    motor?: string;
    combustivel?: string;
    cambio?: string;
    preco: number;
    placa?: string;
    quilometragem?: number;
    tipo: string;
    imageUrl?: string;
    situacao: string;
    status: string;
    defisicoicms?: number;
    defisicoipi?: number;
    taxicms?: number;
    taxipi?: number;
}
export declare class UpdateVeiculoDto {
    marcaId?: number;
    modeloId?: number;
    versaoId?: number;
    ano?: number;
    descricao?: string;
    motor?: string;
    combustivel?: string;
    cambio?: string;
    preco?: number;
    placa?: string;
    quilometragem?: number;
    tipo?: string;
    imageUrl?: string;
    situacao?: string;
    status?: string;
    defisicoicms?: number;
    defisicoipi?: number;
    taxicms?: number;
    taxipi?: number;
}
