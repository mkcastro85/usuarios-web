import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';

export class UserDatasource extends DataSource<any> {

    constructor(private _userList$: Observable<any>) {
        super();
    }

    connect(): Observable<any> {
        return this._userList$;
    }

    disconnect() {
    }
}
