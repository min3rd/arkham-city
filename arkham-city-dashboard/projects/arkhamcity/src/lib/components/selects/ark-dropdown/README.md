# Ark Dropdown Component

A customizable dropdown component that supports search, multiple selection, and reactive forms.

## Features

- Customizable styling (size, rounded corners, colors)
- Search functionality
- Multiple selection
- Compatible with reactive forms
- Custom option templates using ng-content

## Usage

### Basic Usage

```html

<ark-dropdown label="Select an option" placeholder="Choose an option">
  <ng-template #options let-searchText="searchText" let-selectItem="selectItem" let-isSelected="isSelected">
    <div class="dropdown-item" (click)="selectItem({value: 'option1', label: 'Option 1'})">
      Option 1
    </div>
    <div class="dropdown-item" (click)="selectItem({value: 'option2', label: 'Option 2'})">
      Option 2
    </div>
    <div class="dropdown-item" (click)="selectItem({value: 'option3', label: 'Option 3'})">
      Option 3
    </div>
  </ng-template>
</ark-dropdown>
```

### With Search

```html
<!-- In your component.ts file:
myOptions = [
  {value: 'option1', label: 'Option 1'},
  {value: 'option2', label: 'Option 2'},
  {value: 'option3', label: 'Option 3'}
];
-->
<ark-dropdown label="Select an option" placeholder="Choose an option" [searchable]="true">
  <ng-template #options let-searchText="searchText" let-selectItem="selectItem" let-isSelected="isSelected">
    <!-- Loop through options and filter based on searchText -->
    <!-- For each filtered option: -->
    <div class="dropdown-item" (click)="selectItem(option)">
      Option Label
    </div>
  </ng-template>
</ark-dropdown>
```

### Multiple Selection

```html
<!-- In your component.ts file:
myOptions = [
  {value: 'option1', label: 'Option 1'},
  {value: 'option2', label: 'Option 2'},
  {value: 'option3', label: 'Option 3'}
];
-->
<ark-dropdown label="Select options" placeholder="Choose options" [multiple]="true">
  <ng-template #options let-searchText="searchText" let-selectItem="selectItem" let-isSelected="isSelected">
    <!-- For each option in myOptions: -->
    <div
      class="dropdown-item"
      [class.selected]="isSelected(option)"
      (click)="selectItem(option)"
    >
      Option Label
      <!-- If option is selected: -->
      <span>✓</span>
    </div>
  </ng-template>
</ark-dropdown>
```

### With Reactive Forms

```html
<!-- In your component.ts file:
form = new FormGroup({
  option: new FormControl()
});
myOptions = [
  {value: 'option1', label: 'Option 1'},
  {value: 'option2', label: 'Option 2'},
  {value: 'option3', label: 'Option 3'}
];
-->
<form [formGroup]="form">
  <ark-dropdown
    label="Select an option"
    placeholder="Choose an option"
    [formFieldControl]="form.get('option')"
  >
    <ng-template #options let-searchText="searchText" let-selectItem="selectItem" let-isSelected="isSelected">
      <!-- For each option in myOptions: -->
      <div
        class="dropdown-item"
        [class.selected]="isSelected(option)"
        (click)="selectItem(option)"
      >
        Option Label
      </div>
    </ng-template>
  </ark-dropdown>
</form>
```

## Component API

### Inputs

| Input            | Type                                                                                         | Default            | Description                                 |
|------------------|----------------------------------------------------------------------------------------------|--------------------|---------------------------------------------|
| label            | string                                                                                       | undefined          | Label for the dropdown                      |
| placeholder      | string                                                                                       | 'Select an option' | Placeholder text when no option is selected |
| multiple         | boolean                                                                                      | false              | Enable multiple selection                   |
| searchable       | boolean                                                                                      | false              | Enable search functionality                 |
| formFieldControl | AbstractControl                                                                              | null               | Form control for reactive forms             |
| size             | 'sm' \| 'md' \| 'lg'                                                                         | 'md'               | Size of the dropdown                        |
| rounded          | 'full' \| 'lg' \| 'md' \| 'sm' \| 'none'                                                     | 'md'               | Border radius of the dropdown               |
| color            | 'teal' \| 'blue' \| 'red' \| 'green' \| 'yellow' \| 'purple' \| 'pink' \| 'orange' \| 'gray' | 'teal'             | Color theme of the dropdown                 |
| disabled         | boolean                                                                                      | false              | Whether the dropdown is disabled            |

### Outputs

| Output   | Type              | Description                      |
|----------|-------------------|----------------------------------|
| onChange | EventEmitter<any> | Emits when the selection changes |

### Content Children

| Selector             | Description                   |
|----------------------|-------------------------------|
| ng-template[options] | Template for dropdown options |
| ng-template[errors]  | Template for error messages   |

## Template Context Variables

The options template receives the following context variables:

| Variable   | Type     | Description                                   |
|------------|----------|-----------------------------------------------|
| searchText | string   | Current search text (when searchable is true) |
| selectItem | Function | Function to call when an item is selected     |
| isSelected | Function | Function to check if an item is selected      |
