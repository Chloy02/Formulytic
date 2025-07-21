const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft'
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
  answers: {
    section1: {
      respondentName: String,
      district: String,
      age: mongoose.Schema.Types.Mixed, // Allow both string and number
      gender: String,
      education: String,
      employmentBefore: String,
      occupationBefore: String,
      incomeBefore: String,
      receivedBenefit: String,
      schemes: [String],
      otherBenefits: String,
      dateOfBenefit: mongoose.Schema.Types.Mixed, // Allow both string and date
      utilization: [String],
      casteCategory: String,
      subCaste: String,
      tribeIdentity: String,
      marriageOpposed: String,
      relocated: String,
      aadhaarProvided: String,
    },
    section2: {
      occupationAfter: String,
      incomeAfter: String,
      socioEconomicStatusBefore: String,
      financialSecurityScale: mongoose.Schema.Types.Mixed, // Allow both string and number
      spouseEmploymentAfter: String,
      socioEconomicStatusAfter: String,
      socialLifeImpact: String,
      fundDecisionMaker: String,
      financialDependencyReduced: String,
      startedNewLivelihood: String,
    },
    section3: {
      progressiveChangeScale: mongoose.Schema.Types.Mixed, // Allow both string and number
      feltSociallyAccepted: String,
      discriminationReduction: String,
      feltMoreSecure: String,
      livingWithInLaws: String,
      inLawDiscrimination: String,
      inLawDiscriminationDetails: String,
      filedPoliceComplaint: String,
      supportFromNgosOrOfficials: String,
    },
    section4: {
      schemeAwarenessSource: String,
      officialsSupportive: String,
      applicationDifficulty: String,
      timeToReceiveBenefit: String,
      disbursementEffectiveness: String,
      awareOfSchemeDetails: String,
      applicationStatus: String,
      pendingDuration: String,
      rejectionReasonCommunicated: String,
      rejectionReason: String,
      qualityOfInformation: String,
    },
    section5: {
      schemeSuccessCasteDiscrimination: String,
      schemeSuccessSecurity: String,
      areasForImprovement: [String],
      shouldReviseIncentive: String,
      experiencedBenefits: [String],
      shouldContinueScheme: String,
      encourageIntercasteMarriage: String,
      schemeHelpedReduceDiscriminationInArea: String,
      futureSupportExpected: [String],
    },
    section6_DevadasiChildren: {
      childAgeAtMarriage: mongoose.Schema.Types.Mixed, // Allow both string and number
      schemeImprovedDignity: String,
      treatmentDifference: String,
      spouseCaste: String,
      ownsPropertyNow: String,
      inLawAcceptabilityScale: mongoose.Schema.Types.Mixed, // Allow both string and number
      facedStigma: String,
    },
  },
});

module.exports = mongoose.model('Response', responseSchema);
