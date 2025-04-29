package com.projectalpha.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupabaseConfig {

    // application.properties 'den çekiyor
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.apiKey}")
    private String supabaseApiKey;

    @Value("${supabase.secretKey}")
    private String supabaseSecretKey;

    public String getSupabaseUrl() {
        return supabaseUrl;
    }

    public String getSupabaseSecretKey(){return supabaseSecretKey;}

    public String getSupabaseApiKey() {
        return supabaseApiKey;
    }
}
