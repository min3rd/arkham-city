import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ArkDropdownComponent, ArkProgressBar } from 'arkhamcity';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, ArkProgressBar, ArkDropdownComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class DashboardComponent {
  // Sample data for dropdown
  countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
  ];

  // Form for reactive form example
  countryForm = new FormGroup({
    country: new FormControl(),
    multiCountry: new FormControl([]),
  });

  // Filter countries based on search text
  filterCountries(searchText: string) {
    if (!searchText) return this.countries;
    return this.countries.filter(country =>
      country.label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  // Handle selection change
  onCountryChange(value: any) {
    console.log('Selected country:', value);
  }
}
