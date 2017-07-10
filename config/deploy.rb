lock '3.4.0'

set :application, 'stock.goodcity'
set :deploy_to, '/var/www/html/stock.goodcity.hk'
set :log_level, :info

namespace :deploy do
  desc "Locally build the ember site"
  task :build do
    run_locally do
      env = {"EMBER_CLI_CORDOVA" => "0"}
      # env["sentry"] = {
      #   'publicUrl' => 'https://api-staging.goodcity.hk',
      #   'sentryUrl' => 'https://21fe90a0fc944c13b38d8090bc97f5d6:32224c98abc64ab393b2cbdc2acf344e@sentry.io/176461',
      #   'sentryOrganizationSlug' => 'crossroads-foundation-limited',
      #   'sentryProjectSlug' => 'stock-app',
      #   'sentryApiKey' => 'e9cd183c4ceb11e78614002590f546fa'
      # }
      env["APP_SHA"] = `git rev-parse --short #{fetch(:branch)}`.strip
      env["staging"] = "true" if fetch(:stage) == :staging
      system(env, "ember build --environment=production")
    end
  end
  desc "Upload the ember build"
  task :upload do
    tarball = "#{fetch(:application)}.tar.gz"
    run_locally do
      within "dist" do
        execute :rm, "-f", tarball
        execute :tar, "-zcf", tarball, "*"
      end
    end
    on roles(:web) do
      remote_tarball_path = File.join(deploy_to, tarball)
      upload! File.join("dist", tarball), deploy_to
      within deploy_to do
        execute :tar, "-zxvf", remote_tarball_path
        execute :rm, "-f", remote_tarball_path
      end
    end
    run_locally do
      within "dist" do
        execute :rm, "-f", tarball
      end
    end
  end
end

task deploy: %w(deploy:build deploy:upload)
