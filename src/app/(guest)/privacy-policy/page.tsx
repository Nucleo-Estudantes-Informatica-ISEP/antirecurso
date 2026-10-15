import { getMessages } from '@/i18n/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy: React.FC = async () => {
  const t = await getMessages();

  return (
    <section className="container py-10 md:py-14 w-full max-w-3xl">
      <div className="mb-10">
        <Badge variant="soft" className="mb-3">
          {t('copy.privacy')}
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          <span className="gradient-text">{t('policy.privacyTitle')}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">{t('copy.effective_from_20_june_2023')}</p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed">
          <article>
            <h2 className="font-bold text-primary text-lg mb-2">
              {t('copy.application_of_the_general_data_protection_regulation')}
            </h2>
            <p>
              {t(
                'copy.to_understand_what_information_is_collected_and_how_it_is_used_the_computer_science_s'
              )}
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">{t('copy.data_controller')}</h2>
            <p>
              {t(
                'copy.nei_isep_is_responsible_for_processing_your_personal_data_you_can_contact_us_by'
              )}{' '}
              <a
                className="text-primary font-medium hover:underline"
                href="mailto:info@nei-isep.org"
              >
                info@nei-isep.org
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">
              {t('copy.information_collection')}
            </h2>
            <p>
              {t(
                'copy.an_account_is_required_to_use_the_application_this_requires_your_name_password_and_em'
              )}
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">
              {t('copy.rights_of_data_subjects')}
            </h2>
            <p>
              {t(
                'copy.you_have_the_right_to_access_rectify_transfer_erase_restrict_and_object_to_the_proces'
              )}
              <a className="text-primary font-medium hover:underline" href="mailto:geral@cnpd.pt">
                geral@cnpd.pt
              </a>
              {t('copy.to_exercise_your_rights_contact_our_data_protection_officer_at')}{' '}
              <a
                className="text-primary font-medium hover:underline"
                href="mailto:info@nei-isep.org"
              >
                info@nei-isep.org
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">
              {t('copy.information_retention')}
            </h2>
            <p>
              {t(
                'copy.when_your_account_is_deleted_nei_isep_anonymizes_your_personal_information_which_cann'
              )}
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">{t('copy.user_obligations')}</h2>
            <p>
              {t(
                'copy.by_using_antirecurso_you_declare_that_you_have_read_this_privacy_policy_and_agree_wit'
              )}
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">{t('copy.other_terms')}</h2>
            <p>
              {t(
                'copy.your_personal_data_may_be_disclosed_to_public_bodies_or_judicial_authorities_when_req'
              )}
            </p>
          </article>
        </CardContent>
      </Card>
    </section>
  );
};

export default PrivacyPolicy;
