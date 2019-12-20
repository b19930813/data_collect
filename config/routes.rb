Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "pages#index"
  get 'dataCollector', to: "pages#dataCollector"
  get 'dataManager', to: "pages#dataManager"
  get 'setting', to: "pages#setting"
  get 'dataMonitor', to: "pages#dataMonitor"
  namespace :api, defaults: {format: 'json'} do
    resources :settings, only: [:index,:show]
    resources :opcua,only: [:show]
  end
end
