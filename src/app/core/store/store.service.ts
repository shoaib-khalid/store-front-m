import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category } from 'src/app/shared/classes/category';
import { Store } from 'src/app/shared/classes/store';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    storeIdKey = 'store_id';
    currencyKey = 'currency';
    storeIdChange: Subject<string> = new Subject<string>();

    constructor(private http: HttpClient, private apiService: ApiService) { }

    async parseStoreFromUrl() {
        let domain = location.origin;

        if (isDevMode)
            domain = domain.split('.')[0].replace(/^(https?:|)\/\//, '');
        else
            domain = domain.replace(/^(https?:|)\/\//, '').split(':')[0];

        const store: Store = await this.getStoreByDomainName(domain);

        if (this.getStoreId() !== store.id) {
            this.setStoreId(store.id);
            this.storeIdChange.next();
        }

        this.setCurrency(store.regionCountry.currencySymbol);
    }

    private setStoreId(storeId: string) {
        localStorage.setItem(this.storeIdKey, storeId);
    }

    getStoreId() {
        return localStorage.getItem(this.storeIdKey);
    }

    private setCurrency(currency) {
        localStorage.setItem(this.currencyKey, currency);
    }

    getCurrency() {
        return localStorage.getItem(this.currencyKey)
    }

    getCategoryById(categoryId): Promise<Category> {
        return new Promise((resolve, reject) => {
            this.apiService.getCategoryById(categoryId).subscribe(
                (res: any) => {
                    resolve(res.data)
                },
                err => {
                    reject(err)
                }
            )
        })
    }

    getCategoryByName(name: string): Promise<Category> {
        return new Promise((resolve, reject) => {
            this.apiService.getCategoryByName(name, this.getStoreId()).subscribe(
                (res: any) => {
                    resolve(res.data.content[0])
                },
                err => {
                    reject(err)
                }
            )
        })
    }

    getCategories(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.apiService.getCategoryByStoreID(this.getStoreId()).subscribe(
                (res: any) => {
                    resolve(res.data.content)
                },
                err => {
                    reject(err)
                }
            )
        })
    }

    public getStoreProducts() {

        return new Promise((resolve, reject) => {
            this.apiService.getProductSByStoreID(this.getStoreId()).subscribe(
                res => {
                    resolve(res.data.content)
                },
                err => {
                    reject(err)
                }
            )
        })
    }

    getStoreInfoByStoreId(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.apiService.getStoreInfoByID(this.getStoreId()).subscribe(
                (res: any) => {
                    resolve(res.data);
                },
                (error) => {
                    console.error("Failed to get store assets", error);
                    reject(error);
                }
            );
        });
    }

    getStoreByDomainName(domain): Promise<Store> {

        return new Promise((resolve, reject) => {
            this.apiService.getStoreInfoByDomainName(domain).subscribe(
                (res: any) => {
                    resolve(res.data.content[0])
                },
                (err) => {
                    reject(err)
                }
            )
        })
    }

    getStoreInfo(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.apiService.getStoreHoursByID(this.getStoreId()).subscribe(
                (res: any) => {
                    resolve(res.data);
                },
                (error) => {
                    console.error(error);
                    reject(error);
                }
            );
        });
    }

    getProductDetailsByName(seoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getProductsByName(seoName, this.getStoreId()).subscribe(
                (res: any) => {
                    resolve(res.data.content[0]);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getProductsByCategory(
        categoryId: string,
        sortId: string,
        pageNo: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService
                .getProductSByCategory(categoryId, this.getStoreId(), sortId, pageNo)
                .subscribe(
                    (res: any) => {
                        resolve(res.data.content);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }

    getDeliveryOption() {
        return new Promise((resolve, reject) => {
            this.apiService.getDeliveryOption(this.getStoreId()).subscribe(
                async (res: any) => {
                    resolve(res.data);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getPlatformConfig() {

        let fullUrl = location.origin;

        let sanatiseUrl = fullUrl.replace(/^(https?:|)\/\//, '').split(':')[0];

        let domainNameArr = sanatiseUrl.split('.');
        domainNameArr.shift();

        let domain = domainNameArr.join('.');

        domain = "dev-pk.symplified.ai"

        return new Promise((resolve, reject) => {
            this.apiService.getPlatformConfig(domain).subscribe(
                (res: any)=> {
                    resolve(res.data[0]);
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }
}
