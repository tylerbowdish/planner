class RegistrationsController < Devise::RegistrationsController
	before_filter :update_sanitized_params
	def update_sanitized_params
		devise_parameter_sanitizer.permit(:sign_up){|u|
			u.permit(:login, :email, :password, :password_confirmation)}
		end
	end