Rails.application.routes.draw do
  get 'room/show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "pages#index"

  get 'dataCollector', to: "pages#dataCollector"
  get 'dataManager', to: "pages#dataManager"
  get 'setting', to: "pages#setting"
  get 'dataMonitor', to: "pages#dataMonitor"
  get 'testPage', to: "pages#testPage"
  namespace :api, defaults: {format: 'json'} do
    resources :settings, only: [:index,:show]
    resources :opcua,only: [:show]
    resources :datagroup
    resources :test
    resources :openua,only: [:show]
    resources :kepware
    resources :datalogger
    resources :datatable, only: [:create,:destroy]
  end
  mount ActionCable.server => '/cable'
end