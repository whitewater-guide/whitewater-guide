import { Meteor } from 'meteor/meteor';
import MailChimp from 'mailchimp-api-v3';

const mailchimp = new MailChimp(Meteor.settings.private.mailchimp.apiKey);

export const emailResolvers = {

  Mutation: {
    mailSubscribe: (root, { mail }) => {
      mailchimp.post(
        `/lists/${Meteor.settings.private.mailchimp.listId}/members`,
        {
          email_address: mail,
          status: 'subscribed',
        }
        )
        .then(({ email_address, status }) => {
          console.log(`Mailchimp: ${email_address} was ${status}!`);
        })
        .catch(err => console.warn(`Mailchimp error, ${err}`));
      return true;
    }
  }
};
