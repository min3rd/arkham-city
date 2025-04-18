import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
import { CreateRuleReqDto, RuleResDto, UpdateRuleReqDto } from './rule.types';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../../core/type/response.type';
import { ConfigService } from '../../../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private _rules: BehaviorSubject<RuleResDto[] | null> = new BehaviorSubject<RuleResDto[] | null>(null);
  private _rule: BehaviorSubject<RuleResDto | null> = new BehaviorSubject<RuleResDto | null>(null);
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);

  get rules$(): Observable<RuleResDto[] | null> {
    return this._rules.asObservable();
  }

  get rule$(): Observable<RuleResDto | null> {
    return this._rule.asObservable();
  }

  all(projectId: string): Observable<ApiResponse<RuleResDto[]>> {
    return this.httpClient.get<ApiResponse<RuleResDto[]>>(this.configService.endpoint(`/projects/${projectId}/firestore/rules`)).pipe(switchMap(response => {
      this._rules.next(response.data);
      return of(response);
    }));
  }

  get(projectId: string, ruleId: string): Observable<ApiResponse<RuleResDto>> {
    return this.httpClient.get<ApiResponse<RuleResDto>>(this.configService.endpoint(`/projects/${projectId}/firestore/rules/${ruleId}`)).pipe(switchMap(response => {
      this._rule.next(response.data);
      return of(response);
    }));
  }

  create(projectId: string, rule: CreateRuleReqDto): Observable<ApiResponse<RuleResDto>> {
    return this._rules.pipe(take(1), switchMap(rules => this.httpClient.post<ApiResponse<RuleResDto>>(this.configService.endpoint(`/projects/${projectId}/firestore/rules`), rule).pipe(switchMap(response => {
      if (!rules) {
        rules = [];
      }
      this._rules.next([...rules, response.data]);
      this._rule.next(response.data);
      return of(response);
    }))));
  }

  update(projectId: string, ruleId: string, rule: UpdateRuleReqDto): Observable<ApiResponse<RuleResDto>> {
    return this._rules.pipe(take(1), switchMap(rules => this.httpClient.put<ApiResponse<RuleResDto>>(this.configService.endpoint(`/projects/${projectId}/firestore/rules/${ruleId}`), rule).pipe(switchMap(response => {
      if (rules) {
        const index = rules.findIndex(rule => rule._id === ruleId);
        if (index !== -1) {
          rules[index] = response.data;
          this._rules.next([...rules]);
        }
      }
      this._rule.next(response.data);
      return of(response);
    }))));
  }

  delete(projectId: string, ruleId: string): Observable<ApiResponse<RuleResDto>> {
    return this._rules.pipe(take(1), switchMap(rules => this.httpClient.delete<ApiResponse<RuleResDto>>(this.configService.endpoint(`/projects/${projectId}/firestore/rules/${ruleId}`)).pipe(switchMap(response => {
      if (rules) {
        const index = rules.findIndex(rule => rule._id === ruleId);
        if (index !== -1) {
          rules.splice(index, 1);
          this._rules.next([...rules]);
        }
      }
      this._rule.next(null);
      return of(response);
    }))));
  }

  reset(): void {
    this._rule.next(null);
  }
}
