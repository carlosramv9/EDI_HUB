export interface IOption {
    value?:number;
    text?:string;
    args?:string;
}

export interface IOptionChecked extends IOption {
    checked?: boolean;
}

export default IOption;