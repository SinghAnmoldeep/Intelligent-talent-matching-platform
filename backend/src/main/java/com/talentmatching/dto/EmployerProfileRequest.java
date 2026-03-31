package com.talentmatching.dto;

// DTO for creating/updating employer profile
public class EmployerProfileRequest {

    private String companyName;
    private String contactEmail;
    private String industry;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
}
