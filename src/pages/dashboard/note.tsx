import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ListNotesView } from 'src/note/view/list-notes-view';

// ----------------------------------------------------------------------

const metadata = { title: `Page one | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ListNotesView/>
    </>
  );
}
