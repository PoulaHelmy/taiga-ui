import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
    TuiDataListModule,
    TuiDropdownModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
    TuiInputCountModule,
    TuiSelectModule,
    TuiValueAccessorModule,
} from '@taiga-ui/kit';
import {TextMaskModule} from 'angular2-text-mask';

import {TuiColorEditComponent} from './color-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TextMaskModule,
        TuiValueAccessorModule,
        TuiSelectModule,
        TuiPrimitiveTextfieldModule,
        TuiTextfieldControllerModule,
        TuiDropdownModule,
        TuiInputCountModule,
        TuiDataListModule,
    ],
    declarations: [TuiColorEditComponent],
    exports: [TuiColorEditComponent],
})
export class TuiColorEditModule {}
