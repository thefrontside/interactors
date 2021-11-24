import { converge } from "./converge";
import { interaction } from "./interaction";
import { serializeOptions, unsafeSyncResolveUnique } from './constructor'
import { EmptyObject, FilterReturn, Interactor } from "./specification";

export const read = <E extends Element, F extends EmptyObject>(interactor: Interactor<E, F>, field: keyof F): Promise<FilterReturn<F>> => {
  let filter = interactor.options.specification.filters?.[field]
  return interaction(`get ${field} from ${interactor.description}`, async () => {
    let filterFn = typeof(filter) === 'function' ? filter : filter.apply
    return await converge(() => filterFn(unsafeSyncResolveUnique(interactor.options)));
  }, serializeOptions('read', interactor.options));
}
