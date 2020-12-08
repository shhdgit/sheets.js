import { interfaces } from 'inversify';

const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

export type InjectionToken<T> = interfaces.ServiceIdentifier<T>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const InjectionToken = <T>(desc: string): InjectionToken<T> => (hasSymbol ? Symbol(desc) : desc) as any;
